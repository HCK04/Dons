<?php

namespace App\Controller;

use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class DonorController extends AbstractController
{
    #[Route('/api/donors', name: 'api_donors_list', methods: ['GET'])]
    public function list(Connection $db): JsonResponse
    {
        $rows = $db->fetchAllAssociative('SELECT id, nom, email FROM donors ORDER BY nom ASC');
        return $this->json($rows);
    }
}
